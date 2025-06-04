// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // --- NUEVA LÓGICA PARA EL CAMPO "MUNICIPALIDAD" con datalist y sugerencias ---
    const municipalidadInput = document.getElementById('municipalidad');
    const sugerenciasMunicipalidadesDatalist = document.getElementById('sugerenciasMunicipalidades');

    // Función para inicializar las sugerencias de municipalidades desde la imagen
    function inicializarSugerenciasMunicipalidades() {
        let sugerenciasGuardadas = JSON.parse(localStorage.getItem('municipalidadesSugerencias')) || [];

        // Opciones de municipalidades obtenidas de la imagen adjunta
        const opcionesMunicipalidades = [
            "ESCUINTLA", "MASAGUA", "GUANAGAZAPA", "LA DEMOCRACIA", "LA GOMERA", "SIPACATE", "TAXISCO", "PUERTO IZAPA", "PUERTO DE SAN JOSÉ", "SIQUINALA", "SANTA LUCIA COTZUMALGUAPA", "PALIN", "SAN VICENTE PACAYA", "SAN LUCAS SACATEPEQUEZ", "SANTIAGO SACATEPEQUEZ", "SANTO DOMINGO XENACOJ", "SUMPANGO", "SANTA LUCIA MILPAS ALTAS", "SAN BARTOLOME MILPAS ALTAS", "MAGDALENA MILPAS ALTAS", "JOCOTENANGO", "SAN ANDRES ITZAPA", "PASTORES", "CIUDAD VIEJA", "SANTA CATARINA BARAHONA", "SAN ANTONIO AGUAS CALIENTES", "SAN JUAN ALOTENANGO", "SAN MIGUEL DUEÑAS", "SANTA MARIA DE JESUS", "ANTIGUA GUATEMALA", "GUATEMALA", "SAN JUAN SACATEPEQUEZ", "MIXCO", "SAN JOSE DEL GOLFO", "PALENCIA", "SAN PEDRO AYAMPUC", "CHUARRANCHO", "SAN PEDRO SACATEPEQUEZ", "SAN RAYMUNDO", "SAN JOSE PINULA", "FRAIJANES", "SANTA CATARINA PINULA", "VILLA CANALES", "AMATITLAN", "SAN MIGUEL PETAPA", "VILLA NUEVA"
        ];

        // Añadir solo las opciones de municipalidades que no estén ya en sugerenciasGuardadas
        opcionesMunicipalidades.forEach(opcion => {
            if (!sugerenciasGuardadas.includes(opcion)) {
                sugerenciasGuardadas.push(opcion);
            }
        });

        localStorage.setItem('municipalidadesSugerencias', JSON.stringify(sugerenciasGuardadas));
    }

    // Función para cargar sugerencias de municipalidades desde localStorage al datalist
    function cargarSugerenciasMunicipalidades() {
        const sugerenciasGuardadas = JSON.parse(localStorage.getItem('municipalidadesSugerencias')) || [];
        sugerenciasMunicipalidadesDatalist.innerHTML = ''; // Limpiar opciones existentes
        sugerenciasGuardadas.forEach(sugerencia => {
            const option = document.createElement('option');
            option.value = sugerencia;
            sugerenciasMunicipalidadesDatalist.appendChild(option);
        });
    }

    // Función para guardar nuevas sugerencias de municipalidades (si el usuario ingresa una nueva)
    function guardarSugerenciaMunicipalidad(nuevaSugerencia) {
        if (!nuevaSugerencia || nuevaSugerencia.trim() === "") return;

        let sugerenciasGuardadas = JSON.parse(localStorage.getItem('municipalidadesSugerencias')) || [];
        if (!sugerenciasGuardadas.includes(nuevaSugerencia)) {
            sugerenciasGuardadas.push(nuevaSugerencia);
            localStorage.setItem('municipalidadesSugerencias', JSON.stringify(sugerenciasGuardadas));
            cargarSugerenciasMunicipalidades(); // Recargar el datalist
        }
    }

    // Iniciar: Asegurar que las opciones de municipalidades HTML estén en localStorage y luego cargar todo
    inicializarSugerenciasMunicipalidades();
    cargarSugerenciasMunicipalidades();

    // Guardar la sugerencia cuando el usuario salga del input de municipalidad
    municipalidadInput.addEventListener('blur', () => {
        guardarSugerenciaMunicipalidad(municipalidadInput.value.trim());
    });

    // Opcional: Guardar también al presionar Enter en el input de municipalidad
    municipalidadInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            guardarSugerenciaMunicipalidad(municipalidadInput.value.trim());
        }
    });


    // --- Lógica existente para el total de dispositivos (conservada de tu código) ---
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const totalDispositivosSpan = document.getElementById('totalDispositivos');

    function calcularTotal() {
        let total = 0;
        quantityInputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        totalDispositivosSpan.textContent = total;
    }

    quantityInputs.forEach(input => {
        input.addEventListener('input', calcularTotal);
    });

    calcularTotal(); // Calcular el total inicial


    // Inicializar los pads de firma
    const firmaAcompananteCanvas = document.getElementById('firmaAcompananteCanvas');
    const firmaOficialCanvas = document.getElementById('firmaOficialCanvas');
    
    // Configurar los pads de firma
    const signaturePadAcompanante = new SignaturePad(firmaAcompananteCanvas, {
        backgroundColor: 'rgb(255, 255, 255)', // fondo blanco
        penColor: 'rgb(0, 0, 0)' // color negro para la firma
    });
    
    const signaturePadOficial = new SignaturePad(firmaOficialCanvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
    });

    // Ajustar el tamaño de los canvas al cambiar el tamaño de la ventana
    function resizeCanvas(canvas) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext("2d").scale(ratio, ratio);
    }

    // Aplicar el ajuste inicial y en redimensionamiento
    [firmaAcompananteCanvas, firmaOficialCanvas].forEach(canvas => {
        resizeCanvas(canvas);
        window.addEventListener('resize', () => resizeCanvas(canvas));
    });

    // Botones para borrar firmas
    document.querySelectorAll('.clear-signature-btn').forEach(button => {
        button.addEventListener('click', function() {
            const canvasId = this.getAttribute('data-canvas-id');
            const canvas = document.getElementById(canvasId);
            
            if (canvasId === 'firmaAcompananteCanvas') {
                signaturePadAcompanante.clear();
                document.getElementById('firmaAcompananteData').value = '';
            } else if (canvasId === 'firmaOficialCanvas') {
                signaturePadOficial.clear();
                document.getElementById('firmaOficialData').value = '';
            }
        });
    });

    // Configurar la fecha actual por defecto
    const fechaActual = new Date().toISOString().split('T')[0];
    document.getElementById('fechaReporte').value = fechaActual;

    // Configurar la hora actual por defecto
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    document.getElementById('horaReporte').value = `${horas}:${minutos}`;

    // Calcular el total de dispositivos
    function calcularTotalDispositivos() {
        const inputs = document.querySelectorAll('.quantity-input');
        let total = 0;
        
        inputs.forEach(input => {
            const valor = parseInt(input.value) || 0;
            total += valor;
        });
        
        document.getElementById('totalDispositivos').textContent = total;
    }

    // Escuchar cambios en los inputs de cantidad
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', calcularTotalDispositivos);
        input.addEventListener('input', calcularTotalDispositivos);
    });

    // Limitar dpiCle a 13 dígitos numéricos
    document.getElementById('dpiCle').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 13);
    });

    // Limitar movil a 8 dígitos numéricos
    document.getElementById('movil').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });

    // Botón para enviar y descargar PDF
    document.getElementById('submitAndDownloadBtn').addEventListener('click', function() {
        // Guardar las firmas como datos de imagen
        if (!signaturePadAcompanante.isEmpty()) {
            document.getElementById('firmaAcompananteData').value = signaturePadAcompanante.toDataURL();
        }
        
        if (!signaturePadOficial.isEmpty()) {
            document.getElementById('firmaOficialData').value = signaturePadOficial.toDataURL();
        }

        // Validar campos requeridos
        const oficialInventario = document.getElementById('oficialInventario').value.trim();
        const fechaReporte = document.getElementById('fechaReporte').value;
        const horaReporte = document.getElementById('horaReporte').value;
        const municipalidad = document.getElementById('municipalidad').value.trim();
        const dpiCle = document.getElementById('dpiCle').value.trim();
        const movil = document.getElementById('movil').value.trim();
        if (!oficialInventario || !fechaReporte || !horaReporte || !municipalidad) {
            alert('Por favor complete todos los campos requeridos: Oficial de Inventario, Fecha, Hora de Reporte y Municipalidad');
            return;
        }

        // Validar DPI: si no está vacío, debe tener exactamente 13 dígitos
        if (dpiCle !== "" && dpiCle.length !== 13) {
            alert('El campo DPI (CUI) debe contener exactamente 13 dígitos numéricos.');
            document.getElementById('dpiCle').focus();
            return;
        }
        // Validar movil: si no está vacío, debe tener exactamente 8 dígitos
        if (movil !== "" && movil.length !== 8) {
            alert('El campo Movil debe contener exactamente 8 dígitos numéricos.');
            document.getElementById('movil').focus();
            return;
        }

        // Generar PDF
        generarPDF();
    });

    // Función para generar PDF
    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById('printableArea');

        // Obtener los inputs de fecha y hora
        const fechaInput = document.getElementById('fechaReporte');
        const horaInput = document.getElementById('horaReporte');

        // Crear spans temporales con los valores
        const fechaSpan = document.createElement('span');
        fechaSpan.textContent = fechaInput.value;
        fechaSpan.style.font = "inherit";
        fechaSpan.style.padding = "2px 4px";
        fechaSpan.style.borderBottom = "1px solid #000";

        const horaSpan = document.createElement('span');
        horaSpan.textContent = horaInput.value;
        horaSpan.style.font = "inherit";
        horaSpan.style.padding = "2px 4px";
        horaSpan.style.borderBottom = "1px solid #000";

        // Reemplazar los inputs por los spans
        fechaInput.parentNode.replaceChild(fechaSpan, fechaInput);
        horaInput.parentNode.replaceChild(horaSpan, horaInput);

        // --- OCULTAR PLACEHOLDER TEMPORALMENTE ---
        const inputs = element.querySelectorAll('input[placeholder], textarea[placeholder]');
        const placeholders = [];
        inputs.forEach(input => {
            placeholders.push({ el: input, placeholder: input.placeholder });
            input.placeholder = '';
        });

        html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = canvas.height * imgWidth / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('Bitacora_Inventario_' + new Date().toISOString().slice(0, 10) + '.pdf');
        }).finally(() => {
            // Restaurar los inputs originales
            fechaSpan.parentNode.replaceChild(fechaInput, fechaSpan);
            horaSpan.parentNode.replaceChild(horaInput, horaSpan);

            // --- RESTAURAR PLACEHOLDER ---
            placeholders.forEach(obj => {
                obj.el.placeholder = obj.placeholder;
            });
        });
    }

    
});
