import axios from "axios";


export const Server = {
	baseURL: "https://jsonplaceholder.typicode.com/",
	path: "todos",
};

export const URLConstants = {
	API: Server.baseURL
};
export let BaseAPI = axios.create({
	baseURL: URLConstants.API,
	timeout: 60 * 1000,
});
export let UserAPI = axios.create({
	baseURL: URLConstants.API,
	timeout: 1000 * 60,
});
export const EndPoints = {
	
    allTodos: Server.path,
	
};

export function promiseHandler(promise) {
	return promise
		.then((data) => [data, null])
		.catch((error) => Promise.resolve([null, error]));
}
BaseAPI.interceptors.request.use(
	function (request) {
		console.log("Request " + JSON.stringify(request));

		return request;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	}
);
BaseAPI.interceptors.response.use(
	function (response) {
		// console.log(
		// 	"Response URL " +
		// 		response.config.url +
		// 		"\n Data " +
		// 		JSON.stringify(response.data)
		// );
		return response;
	},
	function (error) {
		console.log(
			"HTTP Error code " +
				error.response.status +
				" error " +
				JSON.stringify(error.response.data)
		);
		return Promise.reject(error);
	}
);

export async function getAllTodos() {
	try {
		let response = await BaseAPI.get(EndPoints.allTodos);
		if (response.data) {
            // console.log('getAllTodos ' + response.data)
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}

export async function deleteTodo(todoId) {
	try {
		let response = await BaseAPI.delete(EndPoints.allTodos+"/"+todoId);
		if (response.data) {
            console.log('deleteTodo ' + JSON.stringify(response.data))
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		return Promise.reject(error);
	}
}

export async function addTodo(data) {
	try {
		let response = await BaseAPI.post(EndPoints.allTodos, data);
		if (response.data) {
            console.log('addTodo ' + JSON.stringify(response.data))
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		return Promise.reject(error);
	}
}

export async function editTodo(todoId, data) {
	try {
		let response = await BaseAPI.put(EndPoints.allTodos+"/"+todoId, data);
		if (response.data) {
            console.log('editTodo ' + JSON.stringify(response.data))
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		return Promise.reject(error);
	}
}