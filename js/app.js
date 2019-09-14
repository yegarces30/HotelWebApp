var arregloHoteles = [];

//funcion Exito permite motrar el mapa teniendo en cuenta la posición entregada.
//Recibe como parámetro pos, el cual contiene la posición a centrar en el mapa y poner un marcador.
//
function exito(pos) {         
  var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude); 
  posicionActual = latlng;
  mostrarMapa("divMapa",latlng);            
}

//funcion fallido permite identificar el error en caso de no poder tomar la posición actual
//Recibe como parámetro error, el cual contiene la información del error para mostrar.
//
function fallido(error) {           
    if (error.code == 0) {
      alert("Oops! No se puede obtener la posición actual.");
    }
    if (error.code == 1) {
      alert("Oops! Algo ha salido mal.");
    }
    if (error.code == 2) {
      alert("Oops! No has aceptado compartir tu posición.");
    }
    if (error.code == 3) {
      alert("Oops! Hemos superado el tiempo de espera");
    }        
}      

//funcion obtenerPosicionActual permite utilizar el objeto navigator para obtener la posición actual del usuario
//
function obtenerPosicionActual() {
  if (navigator.geolocation) {        
    navigator.geolocation.getCurrentPosition(exito, fallido, {
        maximumAge: 500000,
        enableHighAccuracy: true,
        timeout: 6000
    });
  }
}

//función cambiarpagina permite hacer llamado a otra página usando la transición slideup
//Recibe como parámetro page, que es el nombre de la página a mostrar.
//
function cambiarPagina(page) {
  $.mobile.changePage("#" + page, {
      transition: "slideup"
  });
}

//La función guardaHotel obtiene la información del formulario y posteriormente la guarda en un arreglo de hoteles
//
function guardarHotel(){
  let nombre = $("#nombreHotel").val();
  let ciudad = $("#ciudad").val();
  let telefono = $("#telefono").val();
  let estrellas = $("#estrellas").val();

  hotel = {
    nombre: nombre,
    ciudad: ciudad,
    telefono: telefono,
    estrellas: estrellas,
    posicion: posicionActual

  }

  arregloHoteles.push(hotel);
}

//función listarHoteles permite generar un listview con todos los hoteles creados en el sistema
//
function listarHoteles(){
  $("#listaHoteles").html("");
  for (var i = 0; i < arregloHoteles.length; i++) {
     $("#listaHoteles").append("<li name='li_"+i+"' class='ui-listview-item'><a  name='a_"+i+"' onclick='obtenerDatosHotel("+i+")' >"+arregloHoteles[i].nombre+"</a></li>");
  }
  $("#listaHoteles").listview("refresh");
}

//función mostrarMapa permite crear el mapa para mostrar y su marcador
//Recibe el parámetro elementoMapa el cual consiste en el id del div en donde se ubicará el mapa.
//Recibe como parámetro posicion el cual contiene la información de latitud y longitud para ubicar el marcador.
//
function mostrarMapa(elementoMapa,posicion) {
  let opciones = {            
      zoom: 10,
      center: posicion,
      mapTypeId: google.maps.MapTypeId.ROADMAP        
  };
     
  let mapa = new google.maps.Map(document.getElementById(elementoMapa), opciones);   
  let marcador1;
  marcador1 = new google.maps.Marker({            
      position: posicion,
      map: mapa,
      draggable: true,
      title: "Mi punto!!"        
  });

  marcador1.addListener( 'dragend', function (event){
    posicionActual = this.getPosition();
  });                 
}

//función obtenerDatosHotel permite mostrar la información del hotel seleccionado.
//Recibe como parámetro posicion del arreglo de hoteles
//
function obtenerDatosHotel(posicion){
  let datos = "";
  $("#datos").html(datos);
  datos += "<strong>Nombre:</strong>"+arregloHoteles[posicion].nombre+"</br>";
  datos += "<strong>Ciudad:</strong>"+arregloHoteles[posicion].ciudad+"</br>";
  datos += "<strong>Telefono:</strong>"+arregloHoteles[posicion].telefono+"</br>";
  datos += "<strong>Estrella:</strong>"+arregloHoteles[posicion].estrellas+"</br>";
  datos += "<strong>Ubicación:</strong></br>";
  $("#datos").html(datos);
  mostrarMapa("divMapa1",arregloHoteles[posicion].posicion);
  cambiarPagina("paginaDatos");
}

//Funcion donde se inicializan todas los aspectos generales de la aplicación
$(document).ready(function() {

  var listaHoteles = [];
  var posicionActual = null;

  $( "#listaHoteles" ).listview({
    autodividers: false
  });

  $("#registrarHotel").click( function() {
    $("#nombreHotel").val("");
    $("#ciudad").val("");
    $("#telefono").val("");
    $("#estrellas").val("");
    obtenerPosicionActual();
    cambiarPagina("paginaRegistro");
  });

  $("#listarHotel").click( function() {
    listarHoteles();
    cambiarPagina("paginaLista");
  });

  $("#guardarHotel").click( function() {
      guardarHotel();
      cambiarPagina("paginaInicio");
  });

  $("#volverPaginaInicio1").click( function() {
      cambiarPagina("paginaInicio");
  });

  $("#volverPaginaInicio2").click( function() {
      cambiarPagina("paginaInicio");
  });

  $("#volverListaHoteles").click( function() {
    listarHoteles();
    cambiarPagina("paginaLista");
  });

  $(document).on("pagechange",function(event,data){
    let page = $.mobile.activePage.attr("id");
    if(page == "paginaLista"){
      $("#listaHoteles").listview("refresh");
    }
  });

  obtenerPosicionActual();
});
