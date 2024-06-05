const url_api = import.meta.env.VITE_URL_API || process.env.VITE_URL_API;

let rutasConsulta = {
	"consultar.servidores-publicos-intervienen-contrataciones": url_api + `/listS2v2`,
}

export default rutasConsulta;
