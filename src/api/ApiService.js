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
		console.log(
			"Response URL " +
				response.config.url +
				"\n Data " +
				JSON.stringify(response.data)
		);
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

UserAPI.interceptors.request.use(
	async function (request) {
		request.headers["deviceUUID"] = "1";
		request.headers["Remote_Addr"] = "2";
		await authUtils.load();
		if (!!authUtils.userToken)
			request.headers["Authorization"] = authUtils.userToken;
		
		request.headers["Content-Type"] = "multipart/form-data;";
		request.headers["Accept"] = "*/*";

		console.log("Requesting " + JSON.stringify(request));
		return request;
	},
	function (error) {
		return Promise.reject(error);
	}
);
UserAPI.interceptors.response.use(
	function (response) {
		console.log(
			"Response URL " +
				response.config.url +
				"\n Data " +
				JSON.stringify(response.data)
		);
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
            console.log('getAllTodos ' + response.data)
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

// export async function getAllTodos() {
// 	try {
//         const response = await axios.get(
//           'https://jsonplaceholder.typicode.com/todos',
//         );
//         return JSON.stringify(response.data);
//         // alert(JSON.stringify(response.data));
//       } catch (error) {
//         // handle error
//         console.log(error.message);
//         return error.message
//       }
// }

export async function loginWithMobile(data) {
	try {
		let response = await BaseAPI.post(EndPoints.loginMobile, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function loginWithPIN(data) {
	try {
		let response = await BaseAPI.post(EndPoints.loginPIN, data);
		if (response.data.success) {
			if (response?.data?.accessToken) {
				if (response?.data?.response) {
					authUtils.saveUser(response.data?.response);
				}
				if (!!response?.data?.accessToken?.Authorization) {
					authUtils.saveUserToken(response?.data?.accessToken?.Authorization);
				}

				if (!!response?.data?.accessToken?.REFRESH_TOKEN) {
					authUtils.saveUserRefreshToken(
						response?.data?.accessToken?.REFRESH_TOKEN
					);
				}
				if (!!response?.data?.response?.manufacturer?.manufacturerId) {
					authUtils.saveManufacturerId(
						response?.data?.response?.manufacturer?.manufacturerId
					);
				}
				if (!!response?.data?.response?.firstName) {
					authUtils.saveUserName(response?.data?.response?.firstName);
				}
				if (!!response?.data?.response?.manufacturer?.manufacturerName) {
					authUtils.saveManufacuterName(
						response?.data?.response?.manufacturer?.manufacturerName
					);
				}
				if (!!response?.data?.response?.manufacturer?.manufacturerLogo) {
					authUtils.saveManufacturerLogo(
						response?.data?.response?.manufacturer?.manufacturerLogo
					);
				}
				if (
					!!response?.data?.response?.manufacturer?.addressName ||
					!!response?.data?.response?.manufacturer?.addressLine1 ||
					!!response?.data?.response?.manufacturer?.addressLine2 ||
					!!response?.data?.response?.manufacturer?.city ||
					!!response?.data?.response?.manufacturer?.zipcode ||
					!!response?.data?.response?.manufacturer?.state
				) {
					const address =
						(response?.data?.response?.manufacturer?.addressName ?? "") +
						" " +
						(response?.data?.response?.manufacturer?.addressLine1 ?? "") +
						" " +
						(response?.data?.response?.manufacturer?.addressLine2 ?? "") +
						" " +
						(response?.data?.response?.manufacturer?.city ?? "") +
						" " +
						(response?.data?.response?.manufacturer?.zipcode ?? "") +
						" " +
						(response?.data?.response?.manufacturer?.state ?? "");
					console.log(`Manufacturer address ${address}`);
					authUtils.saveManufacturerAddress(address);
				}
				if (!!response?.data?.response?.phoneNumber) {
					authUtils.saveManufacturerPhone(
						response?.data?.response?.phoneNumber
					);
				}
			}
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		console.log("Log in PIN error " + error);
		return Promise.reject(error);
	}
}
export async function validateLoginOTP(data) {
	try {
		let response = await BaseAPI.post(EndPoints.validateLoginOTP, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function setupNewPIN(data) {
	try {
		let response = await BaseAPI.post(EndPoints.pinSetup, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function changePIN(data) {
	try {
		let response = await BaseAPI.put(EndPoints.pinChange, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function resetPIN(data) {
	try {
		let response = await BaseAPI.post(EndPoints.resetPIN, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function sendOTPOnForgotPIN(data) {
	try {
		let response = await BaseAPI.post(EndPoints.sendOTPOnForgotPIN, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function sendOTPOnSetupPIN(data) {
	try {
		let response = await BaseAPI.post(EndPoints.sendOTPOnForgotPIN, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function verifyOTPOnForgotPIN(data) {
	try {
		let response = await BaseAPI.post(EndPoints.verifyOTPOnForgotPIN, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function getProducts() {
	try {
		let response = await UserAPI.get(
			EndPoints.getProductsPath + authUtils.manufacturerId
		);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function getProductMasterData(category) {
	try {
		let response = await UserAPI.get(EndPoints.getProductMasterData + category);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function getProductDetails(id) {
	try {
		let response = await UserAPI.get(EndPoints.getProductDetails + "/" + id);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
export async function addNewProduct(formData) {
	try {
		console.log(`Form data ` + JSON.stringify(formData));
		let response = await UserAPI.post(EndPoints.saveProduct, formData);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		return Promise.reject(error);
	}
}
export async function postNewProduct(req) {
	try {
		var data = new FormData();
		let imagePath =
			"file:///data/user/0/com.sb2mobileapp/files/310322_075715.jpg";

		file = { uri: imagePath, name: "document", type: "image/jpg" };
		// data.append("category", "plate2");
		// data.append("subCategory", "fork");
		// data.append("style", "curved");
		// data.append("mfrProductSpecs[0].msrFieldsSpecsId", "1");
		// data.append("mfrProductSpecs[0].fieldCode", "weight");
		// data.append("mfrProductSpecs[0].minValue", "10");
		// data.append("mfrProductSpecs[0].unitTypeId", "2002");

		const files = [
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "front",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "back",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "right",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "left",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "zoom in",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "zoom out",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "top",
			},
			{
				uri: imagePath,
				name: "document",
				type: "image/jpg",
				photoDirection: "bottom",
			},
		];
		files.forEach((file, index) => {
			data.append(`mfrProductImages[${index}].image`, file);
			data.append(`mfrProductImages[${index}].type`, file.photoDirection);
		});

		// data.append("mfrProductImages[0].type", "front");
		// data.append("mfrProductImages[1].type", "back");
		// data.append("mfrProductImages[2].type", "right");
		// data.append("mfrProductImages[3].type", "left");
		// data.append("mfrProductImages[4].type", "zoom in");
		// data.append("mfrProductImages[5].type", "zoom out");
		// data.append("mfrProductImages[6].type", "top");
		// data.append("mfrProductImages[7].type", "bottom");

		console.log(`Form data ` + JSON.stringify(data));
		let response = await UserAPI.post(EndPoints.saveProduct, data);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		return Promise.reject(error);
	}
}
export async function getProductMetalsIds() {
	try {
		let response = await UserAPI.get(EndPoints.getMetalIds);
		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
// export async function getFilteredProducts(id) {
// 	try {
// 		let response = await UserAPI.get(
// 			EndPoints.filterProductsByID + "/1?mfrProductCode=" + id
// 		);

// 		if (response.data.success) {
// 			return response.data;
// 		} else {
// 			return Promise.reject(response?.data);
// 		}
// 	} catch (error) {
// 		// console.log('Log in error ' + error)
// 		return Promise.reject(error);
// 	}
// }
export async function getFilteredProducts(productId, category, style) {
	try {
		let query = "";
		if (!!productId) {
			query = "mfrProductCode=" + productId;
		}
		if (!!category) {
			query =
				query + (query.length > 0 ? "&" : "") + "categoryName=" + category;
		}
		if (!!style) {
			query = query + (query.length > 0 ? "&" : "") + "style=" + style;
		}

		let response = await UserAPI.get(
			EndPoints.filterProductsByID + "/1?" + query
		);

		if (response.data.success) {
			return response.data;
		} else {
			return Promise.reject(response?.data);
		}
	} catch (error) {
		// console.log('Log in error ' + error)
		return Promise.reject(error);
	}
}
