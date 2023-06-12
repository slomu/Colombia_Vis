from flask import Flask, render_template, request
import pandas as pd

app = Flask(__name__)

@app.route('/')
def my_form():
    df = pd.read_csv('data/dv_data.csv')
    df2 = pd.read_csv("data/popdata.csv")
    df = df["DEPARTAMENTO"].value_counts().to_dict().items()
    dft = {}
    for x,y in df:
        p = int(df2[df2["dep"] == x].population)
        dft[x] = (round((y/(p/1000)), 2))
    return render_template("choropleth.html", data = dft)

@app.route("/", methods = ["POST"])
def index():
    if request.form["action"] == "Submit":
        df = pd.read_csv('data/dv_data.csv')
        df2 = pd.read_csv("data/popdata.csv")
        c1 = request.form["weapon"]
        c2 = request.form["age"]
        c3 = request.form["gender"]
        if c1 != "0":
            df = df[df["ARMAS MEDIOS"] == c1]
        if c2 != "0":
            df = df[df["GRUPO ETARIO"] == c2]
        if c3 != "0":
            df = df[df["GENERO"] == c3]
        df = df["DEPARTAMENTO"].value_counts().to_dict().items()
        dft = {}
        for x,y in df:
            p = int(df2[df2["dep"] == x].population)
            dft[x] = (round((y/(p/1000)), 2))

        return render_template("choropleth.html" , data = dft)


if __name__ == "__main__":
    app.run(debug=True)