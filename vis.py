from flask import Flask, render_template, request
import pandas as pd
import json
import numpy as np

def convert_int64(item):
    if isinstance(item, np.int64):
        return int(item)
    return item

app = Flask(__name__)

@app.route('/')
def my_form():
    df = pd.read_csv('data/dv_data.csv')
    df2 = pd.read_csv("data/popdata.csv")
    #with open('data/counts.json', 'r') as openfile:
    #    cities = json.load(openfile)
        
    df3 = df["DEPARTAMENTO"].value_counts().to_dict().items()
    col = "1"
    dft = {}
    for x,y in df3:
        p = int(df2[df2["dep"] == x].population)
        dft[x] = (round((y/(p/1000)), 2))

    df4 = df["GENERO"].value_counts().to_dict().items()  
    dfg = {}
    for u,v in df4:
        dfg[u] = int(v)

    df5 = df["GRUPO ETARIO"].value_counts().to_dict().items()  
    dfa = {}
    for u,v in df5:
        dfa[u] = int(v)

    df6_pre = df
    df6_pre["ARMAS MEDIOS"] = df["ARMAS MEDIOS"].replace("narcotics","other")
    df6_pre["ARMAS MEDIOS"] = df["ARMAS MEDIOS"].replace("firearm","other")
    df6_pre["ARMAS MEDIOS"] = df["ARMAS MEDIOS"].replace("slashing weapon","other")
    df6 = df6_pre["ARMAS MEDIOS"].value_counts().to_dict().items()  
    dfw = {}
    for u,v in df6:
        dfw[u] = int(v)
        
               
    citydata = pd.read_csv("data/worldcities.csv")
    #df = pd.read_csv("data/dv_data.csv")
    counts = df["MUNICIPIO"].value_counts()
    #counts.to_csv("data/counts.csv")

    result = {}
    for city in citydata["city_ascii"]:
        try:
            dep = str(citydata[citydata["city_ascii"] == city].admin_name).split()[1]
            if dep == "NORTE":
                dep = "NORTE DE SANTANDER"
            if dep == "SANTAFE":
                dep = "SANTAFE DE BOGOTA D.C"

            if dep not in result:
                result[dep] = []
            
            result[dep].append({
                "city": city,
                "long": float(citydata[citydata["city_ascii"] == city].lng),
                "lat": float(citydata[citydata["city_ascii"] == city].lat),
                "cases": counts[city]
            })
        except (KeyError, TypeError):
            pass    
        
    u_data = json.dumps(result, default=convert_int64)
    city_data = json.loads(u_data)
        
    return render_template("choropleth.html", data = dft, dataG = dfg, dataA = dfa, dataW = dfw, col = col, dataC = city_data)

@app.route("/", methods = ["POST"])
def index():
    if request.form["action"] == "Submit":
        df = pd.read_csv('data/dv_data.csv')
        df2 = pd.read_csv("data/popdata.csv")
        #with open('data/counts.json', 'r') as openfile:
        #    cities = json.load(openfile)
        
        c1 = request.form["weapon"]
        c2 = request.form["age"]
        c3 = request.form["gender"]
        col = request.form["col"]
        if c1 != "0":
            df = df[df["ARMAS MEDIOS"] == c1]
        else:
            df["ARMAS MEDIOS"] = df["ARMAS MEDIOS"].replace("narcotics","other")
            df["ARMAS MEDIOS"] = df["ARMAS MEDIOS"].replace("firearm","other")
            df["ARMAS MEDIOS"] = df["ARMAS MEDIOS"].replace("slashing weapon","other")
        if c2 != "0":
            df = df[df["GRUPO ETARIO"] == c2]
        if c3 != "0":
            df = df[df["GENERO"] == c3]
        df3 = df["DEPARTAMENTO"].value_counts().to_dict().items()
        dft = {}
        for x,y in df3:
            p = int(df2[df2["dep"] == x].population)
            #if c1 != "0" or c2 != "0" or c3 == "MASCULINO":
                #dft[x] = (round((y/(p/10000)), 2))
            #else:
            dft[x] = (round((y/(p/1000)), 2))

        df4 = df["GENERO"].value_counts().to_dict().items()    
        dfg = {}
        for u,v in df4:
            dfg[u] = int(v)

        df5 = df["GRUPO ETARIO"].value_counts().to_dict().items()  
        dfa = {}
        for u,v in df5:
            dfa[u] = int(v)

        df6 = df["ARMAS MEDIOS"].value_counts().to_dict().items()  
        dfw = {}
        for u,v in df6:
            dfw[u] = int(v)
            
        citydata = pd.read_csv("data/worldcities.csv")
        #df = pd.read_csv("data/dv_data.csv")
        counts = df["MUNICIPIO"].value_counts()
        #counts.to_csv("data/counts.csv")

        result = {}
        for city in citydata["city_ascii"]:
            try:
                dep = str(citydata[citydata["city_ascii"] == city].admin_name).split()[1]
                if dep == "NORTE":
                    dep = "NORTE DE SANTANDER"
                if dep == "SANTAFE":
                    dep = "SANTAFE DE BOGOTA D.C"
                if dep == "SAN":
                    dep = "SAN ANDRES"

                if dep not in result:
                    result[dep] = []
                
                result[dep].append({
                    "city": city,
                    "long": float(citydata[citydata["city_ascii"] == city].lng),
                    "lat": float(citydata[citydata["city_ascii"] == city].lat),
                    "cases": counts[city]
                })
            except (KeyError, TypeError):
                pass
            
        u_data = json.dumps(result, default=convert_int64)
        city_data = json.loads(u_data)


        return render_template("choropleth.html" , data = dft, dataG = dfg, dataA = dfa, dataW = dfw, col = col, selected_weapon = c1, selected_age = c2, selected_gender = c3, dataC = city_data)


if __name__ == "__main__":
    app.run(debug=True)