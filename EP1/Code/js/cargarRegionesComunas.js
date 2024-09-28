document.addEventListener('DOMContentLoaded', () => {
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna'); 

    async function cargarDatos() {
        try {
            const response = await fetch('data/comunas-regiones.json');
            if (!response.ok) {
                throw new Error('Error al cargar los datos');
            }
            const data = await response.json();

            data.regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.region;
                option.textContent = region.region;
                regionSelect.appendChild(option);
            });

            function actualizarComunas() {
                const regionName = regionSelect.value;
                const regionData = data.regiones.find(r => r.region === regionName);
                const comunas = (regionData && regionData.comunas) || [];

                comunaSelect.innerHTML = '<option value="">Selecciona tu comuna</option>';

                comunas.forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna;
                    option.textContent = comuna;
                    comunaSelect.appendChild(option);
                });
            }
            regionSelect.addEventListener('change', actualizarComunas);

        } catch (error) {
            console.error('Error al cargar o procesar el archivo JSON:', error);
        }
    }

    cargarDatos();
});
