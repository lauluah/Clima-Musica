const input = document.getElementById('input-busca');
const apiKey = 'ee6a74712c85226d7b7dfc75689ac101';
const clientID = '4e947d342f0d4e08b5ac324af506c51b';
const clientSecret = 'a3ee18cbfc6c4c7d89bd91c249df4e23';

function botaoDeBusca(){
    const inputValue = input.value;
    movimentoInput(inputValue)
};
 
function fecharInput() {
    input.style.visibility = 'hidden';
    input.style.width = '40px';
    input.style.padding = '0.5rem 0.5rem 0.5rem 2.6rem';
    input.style.transition = 'all 0.5s ease-in-out 0s';
    input.value = "";
};

function abrirInput() {
    input.style.visibility = 'visible';
    input.style.width = '300px';
    input.style.padding = '0.5rem 0.5rem 0.5rem 3.1rem';
    input.style.transition = 'all 0.5s ease-in-out 0s';
    input.value = "";
    
};

function mostrarEnvelope() {
    document.querySelector('.envelope').style.visibility = 'visible';
    document.querySelector('.caixa').style.alignItems = 'end';
    document.querySelector('.procura').style.position = 'initial';
};

const videosURLs = [
    './video/video1.mp4',
    './video/video2.mp4',
    './video/video3.mp4',
    './video/video4.mp4',
    './video/video5.mp4',
    './video/video6.mp4'
];

function obterVideosAleatorios(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
};

function recarregarVideos() {
    const videoElement = document.querySelector('.video');
    const videoSource = document.getElementById('video-source');
    const radomVideoURL = obterVideosAleatorios(videosURLs);

    if(videoElement && videoSource) {
        videoSource.src = radomVideoURL;

        videoElement.load()
    }
};

function movimentoInput(inputValue) {
   const visibility = input.style.visibility;
     
   inputValue && procurarCidade(inputValue);
   visibility === 'hidden' ? abrirInput() : fecharInput();
};

input.addEventListener('keyup', function(event) {
    if(event.keyCode === 13) {
        const valorInput = input.value;
        movimentoInput(valorInput)
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fecharInput();
    recarregarVideos() 
});

async function procurarCidade(city) {
    try {
    const dados = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`);
    
        if (dados.status === 200) {
        const resultado = await dados.json();
        const country = resultado.sys.country;

        await obterTopAlbum(country);
        mostrarClimaNaTela(resultado);
        mostrarEnvelope();
      
        } else {
            throw new Error
        }
    } catch {
      alert('A busca pela cidade não obteve resultados');
    }
    
    obterVideosAleatorios();
 }

function mostrarClimaNaTela(resultado) {
        document.querySelector('.icone-tempo').src = `./assents/${resultado.weather[0].icon}.png`
        const cidadeElement = document.querySelector('.cidade');
        if (cidadeElement) {
            cidadeElement.innerHTML = `${resultado.name}`;
        } else {
            console.error('Erro: cidade não encontrada');
        }
        
        const temperaturaElement = document.querySelector('.temperatura');
        if (temperaturaElement) {
            temperaturaElement.innerHTML = `${resultado.main.temp.toFixed(0)}°C`;
        } else {
            console.error('Erro: temperatura não encontrada');
        }
    
    const maxTemperaturaElement = document.querySelector('.maxTemperatura');
    if (maxTemperaturaElement) {
        maxTemperaturaElement.innerHTML = `máx: ${resultado.main.temp_max.toFixed(0)}°C`;
    } else {
        console.error('Erro: temperatura máxima não encontrada');
    }
    
    const minTemperaturaElement = document.querySelector('.minTemperatura');
    if (minTemperaturaElement) {
        minTemperaturaElement.innerHTML = `mín: ${resultado.main.temp_min.toFixed(0)}°C`;
    } else {
        console.error('Erro: temperatura mínima não encontrada');
    }
}

async function obterAcessoToken() {
 const credentials = `${clientID}:${clientSecret}`;
 const encodedCredentials = btoa(credentials);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
             'Authorization': `Basic ${encodedCredentials}`, 
             'Content-Type':  'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials',
    });

 const data = await response.json();
    return data.access_token;
}

function obterDataAtual() {
const currentDate = new Date();
    const ano = currentDate.getFullYear();
    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const dia = currentDate.getDate().toString().padStart(2, '0');
    const hora = currentDate.getHours().toString().padStart(2, '0');
    const minuto = currentDate.getMinutes().toString().padStart(2, '0');
    const segundo = currentDate.getSeconds().toString().padStart(2, '0');
return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;
}

async function obterTopAlbum(country) {
    try {
        const accessToken = await obterAcessoToken();
        const dataAtual = obterDataAtual();
        const url = `https://api.spotify.com/v1/browse/featured-playlists?country=${country}&timestamp=${dataAtual}&limit=3`;

        const resultado = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if (resultado.status === 200) {
            const data = await resultado.json(); 
            const result = data.playlists.items.map(item => ({
                nome: item.name,
                imagem: item.images[0].url
            }));
            
            mostrarPlaylistsNaTela(result); 
        } else {
            throw new Error('Erro ao obter os principais álbuns');
        }

    } catch (error) {
        alert('Erro ao obter os principais álbuns:', error);
    }   
}

const ulElement = document.querySelector('.playlist-caixa');
const liElements = ulElement.querySelectorAll('li');

function mostrarPlaylistsNaTela(dados) {
    liElements.forEach((liElement, index) => {
        const imgElement = liElement.querySelector('img');
        const pElement = liElement.querySelector('p');

        imgElement.src = dados[index].imagem;
        pElement.textContent = dados[index].nome;
    });
    document.querySelector('.playlist-caixa').style.visibility = 'visible';
}
