// scripts.js

document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para sugerencias de municipalidades ---
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


    // --- Total de dispositivos ---
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


    // Limitar dpiCle a 13 dígitos numéricos
    document.getElementById('dpiCle').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 13);
    });
    // Limitar movil a 8 dígitos numéricos
    document.getElementById('movil').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0, 8);
    });

    // Configurar la fecha y hora actual por defecto
    const fechaActual = new Date().toISOString().split('T')[0];
    document.getElementById('fechaReporte').value = fechaActual;
    const ahora = new Date();
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    document.getElementById('horaReporte').value = `${horas}:${minutos}`;


    // --- Lógica para firmas con modal ---
    let signaturePad;
    let currentSignatureTarget = null;

    document.querySelectorAll('.edit-signature-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            currentSignatureTarget = this.dataset.target;
            document.getElementById('signatureModal').style.display = 'flex';
            const canvas = document.getElementById('modalSignatureCanvas');

            // Ajustar el tamaño real del canvas al tamaño mostrado en pantalla
            function resizeCanvas() {
                // Obtener el tamaño mostrado en pantalla
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
            resizeCanvas();

            // Inicializar SignaturePad después de ajustar el tamaño
            signaturePad = new window.SignaturePad(canvas, {
                minWidth: 2,   // Grosor mínimo del trazo
                maxWidth: 4,    // Grosor máximo del trazo
                penColor: 'rgb(43,108,167)' // Color azul para la firma
            });

            // Si ya hay firma previa, cargarla en el canvas
            const imgData = document.getElementById(currentSignatureTarget + 'Data').value;
            if (imgData) {
                const img = new window.Image();
                img.onload = function() {
                    signaturePad.clear();
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                };
                img.src = imgData;
            } else {
                signaturePad.clear();
            }
        });
    });

    document.getElementById('clearModalSignature').onclick = function() {
        signaturePad.clear();
    };

    document.getElementById('closeModalSignature').onclick = function() {
        document.getElementById('signatureModal').style.display = 'none';
    };

    document.getElementById('saveModalSignature').onclick = function() {
        if (!signaturePad.isEmpty()) {
            const dataUrl = signaturePad.toDataURL();
            document.getElementById(currentSignatureTarget + 'Img').src = dataUrl;
            document.getElementById(currentSignatureTarget + 'Img').style.display = 'block';
            document.getElementById(currentSignatureTarget + 'Data').value = dataUrl;
        } else {
            document.getElementById(currentSignatureTarget + 'Img').src = '';
            document.getElementById(currentSignatureTarget + 'Img').style.display = 'none';
            document.getElementById(currentSignatureTarget + 'Data').value = '';
        }
        document.getElementById('signatureModal').style.display = 'none';
    };

    // --- Botón para descargar PDF ---
    document.getElementById('submitAndDownloadBtn').addEventListener('click', function() {
        const oficialInventario = document.getElementById('oficialInventario').value.trim();
        const fechaReporte = document.getElementById('fechaReporte').value;
        const horaReporte = document.getElementById('horaReporte').value;
        const municipalidad = document.getElementById('municipalidad').value.trim();
        const acompananteMunicipal = document.getElementById('acompananteMunicipal').value.trim();
        const firmaOficialImg = document.getElementById('firmaOficialImg').src;
        const dpiCle = document.getElementById('dpiCle').value.trim();
        const movil = document.getElementById('movil').value.trim();

        if (!oficialInventario || !fechaReporte || !horaReporte || !municipalidad) {
            alert('Por favor complete todos los campos requeridos: Oficial de Inventario, Fecha, Hora de Reporte y Municipalidad');
            return;
        }
        if (!acompananteMunicipal) {
            alert('Por favor ingrese el nombre del acompañante municipal.');
            document.getElementById('acompananteMunicipal').focus();
            return;
        }
        if (!firmaOficialImg || firmaOficialImg.endsWith('base64,')) {
            alert('Por favor agregue la firma del Oficial de Inventario (GAUSS).');
            return;
        }
        if (dpiCle !== "" && dpiCle.length !== 13) {
            alert('El campo DPI (CUI) debe contener exactamente 13 dígitos numéricos.');
            document.getElementById('dpiCle').focus();
            return;
        }
        if (movil !== "" && movil.length !== 8) {
            alert('El campo Movil debe contener exactamente 8 dígitos numéricos.');
            document.getElementById('movil').focus();
            return;
        }
        generarPDF();
    });

    // --- Generar PDF ---
    function generarPDF() {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById('printableArea');
        const downloadBtn = document.getElementById('submitAndDownloadBtn');

        // Ocultar botones de editar/Agregar firma
        const editSignatureBtns = document.querySelectorAll('.edit-signature-btn');
        editSignatureBtns.forEach(btn => btn.style.display = 'none');

        // Reemplazar los inputs de fecha y hora por spans temporales
        const fechaInput = document.getElementById('fechaReporte');
        const horaInput = document.getElementById('horaReporte');
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

        fechaInput.parentNode.replaceChild(fechaSpan, fechaInput);
        horaInput.parentNode.replaceChild(horaSpan, horaInput);

        // Ocultar placeholders temporalmente
        const inputs = element.querySelectorAll('input[placeholder], textarea[placeholder]');
        const placeholders = [];
        inputs.forEach(input => {
            placeholders.push({ el: input, placeholder: input.placeholder });
            input.placeholder = '';
        });

        // Ocultar el botón de descarga
        downloadBtn.style.display = 'none';

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

            // Restaurar placeholders
            placeholders.forEach(obj => {
                obj.el.placeholder = obj.placeholder;
            });

            // Mostrar el botón de descarga nuevamente
            downloadBtn.style.display = '';

            // Mostrar los botones de editar/Agregar firma nuevamente
            editSignatureBtns.forEach(btn => btn.style.display = '');
        });
    }
});
