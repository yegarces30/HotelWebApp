$(document).ready(function() {

  var listaHoteles = [];
  var posicionActual = null;

  function mostrarMapa(posicion) {
    var opciones = {            
        zoom: 10,
        center: posicion,
        mapTypeId: google.maps.MapTypeId.ROADMAP        
    };
       
    var mapa = new google.maps.Map(document.getElementById("divMapa"), opciones);   
    var marcador1;
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

  function exito(pos) {         
    var latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude); 
    posicionActual = latlng;
    mostrarMapa(latlng);            
  }
        
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

  function obtenerPosicionActual() {
    if (navigator.geolocation) {        
      navigator.geolocation.getCurrentPosition(exito, fallido, {
          maximumAge: 500000,
          enableHighAccuracy: true,
          timeout: 6000
      });
    }
  }

  function cambiarPagina(page) {
    $.mobile.changePage("#" + page, {
        transition: "slideup"
    });
  }

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

    listaHoteles.push(hotel);
console.log("GUARDO");
console.log(listaHoteles);
  }

  function listarHoteles(){
    $("#listaHoteles").html("");
    let fila = "";
    for (var i = 0; i < listaHoteles.length; i++) {
       fila += "<li name='"+i+"'><a href='acura.html'>"+listaHoteles[i].nombre+"</a></li>"
       console.log("SE METIO");
    }
    $("#listaHoteles").html(fila);
    $("#listaHoteles").listview("refresh");
  }

  $( "#listaHoteles" ).listview({
    autodividers: true,

    // the selector function is passed a <li> element from the listview;
    // it should return the appropriate divider text for that <li>
    // element as a string
    autodividersSelector: function ( li ) {
      var out = $(li).attr("name")/* generate a string based on the content of li */;
      let datos = "";
      datos += "<strong>Nombre:</strong>"+listaHoteles[out].nombre+"</br>";
      datos += "<strong>Ciudad:</strong>"+listaHoteles[out].ciudad+"</br>";
      datos += "<strong>Telefono:</strong>"+listaHoteles[out].telefono+"</br>";
      datos += "<strong>Estrella:</strong>"+listaHoteles[out].estrella|+"</br>";
      $("#datos").html(datos);
      cambiarPagina("paginaDatos");

      return $(li).val();
    }
  });

  $("#registrarHotel").click( function() {
      cambiarPagina("paginaRegistro");
  });
  $("#listarHotel").click( function() {
    listarHoteles();
  });

  $("#guardarHotel").click( function() {
      //función de guardar
      guardarHotel();
      cambiarPagina("paginaInicio");
  });
  $("#volver").click( function() {
      cambiarPagina("paginaInicio");
  });



  obtenerPosicionActual();
});
