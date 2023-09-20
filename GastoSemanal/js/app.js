const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGastos);
}

//Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calculaRestante();
    }
    calculaRestante(){
        const gastado = this.gastos.reduce((total,gasto) => total + gasto.cantidad,0);
        this.restante = this.presupuesto - gastado;
    }
}

class UI{
    insertarPresupuesto(cantidad){
        //console.log(cantidad);
        const {presupuesto,restante} = cantidad;
        //agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje,tipo){
        //crear DIV
        //console.log('hola');
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        //mensaje error
        divMensaje.textContent = mensaje;

        //insertar en el html
        //document.querySelector('.primario').insertBefore(divMensaje.formulario);
        let msj = document.querySelector('.primario');
        msj.insertBefore(divMensaje,formulario);
        //formulario.appendChild(divMensaje);
        //quitar del HTML
        setTimeout(() => {
            divMensaje.remove();
        },3000);
    }

    agregarGastoListado(gastos){
        //Limpiar el HTML
        this.limpiarHTML();

        //iterar sobre los ghastos
        gastos.forEach(gasto => {
            const {cantidad,nombre,id} =  gasto;
            //crear un Li
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;
            //agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">${cantidad} </span>`;
    
            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            nuevoGasto.appendChild(btnBorrar);
            //agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    
    }

    limpiarHTML(){
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoOBJ){
        const {presupuesto,restante} = presupuestoOBJ;

        const restanteDiv = document.querySelector('.restante');
        //comprobar 25%
        if((presupuesto/4) > restante){
            restanteDiv.classList.remove('alert-succes');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto/2)>restante){
            restanteDiv.classList.remove('alert-succes');
            restanteDiv.classList.add('alert-warning');
        }
    }
}

//instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    //console.log(Number(presupuestoUsuario));
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    //console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGastos(e){
    e.preventDefault();
    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    //validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    }else if(cantidad <=0 || isNaN(cantidad)){
        ui.imprimirAlerta('cantidad no valida', 'error');
        return;
    }
    //generar un objeto con el gasto
    const gasto = {nombre,cantidad,id:Date.now()};
    //añadir un nuevo gasto
    presupuesto.nuevoGasto(gasto);
    //mensaje de exito
    ui.imprimirAlerta('Gasto agregado correctamente');
    //pasar los gastos para que se muestre
    const {gastos,restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    //actualizar el restante
    ui.actualizarRestante(restante);
    //comprobar presupuesto
    ui.comprobarPresupuesto(presupuesto);
        //resetear formulario
        formulario.reset();
}

