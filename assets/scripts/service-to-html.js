let data;
fetch('./assets/data/services.json')
    .then(res => {
        return res.json()
    })
    .then(res => {
        fetchAndSetData(res)
    })

const app = document.getElementById('app');
const queryParams = new URLSearchParams(window.location.search);
const id = queryParams.get('id');

function fetchAndSetData(res) {
    data = res
    app.innerHTML = `<h1>${data[id].name}</h1>
                     <div>${data[id].description}</div>       
`
}
