from flask import Flask, render_template, session

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui'  # Necesario para usar sessions

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/reservas')
def reservas():
    return render_template('reservas.html')

@app.route('/habitaciones')
def habitaciones():
    return render_template('habitaciones.html')

@app.route('/clientes')
def clientes():
    return render_template('clientes.html')

@app.route('/usuarios')
def usuarios():
    return render_template('usuarios.html')

if __name__ == '__main__':
    app.run(debug=True)