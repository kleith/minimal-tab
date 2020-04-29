// import store from "../state/store";
// import { showNotification } from "../state/actions";
// import session from "./Session";

/**
 * Devuelve un objeto con los headers mergeados
 * @param {Object} oldOptions
 * @param {Object} newOptions
 * @returns {Object}
 */
const mergeHeaders = (oldOptions, newOptions) => {
  const { headers: oldHeaders, ...restOldOptions } = oldOptions;
  const { headers: newHeaders, ...restNewOptions } = newOptions;

  return {
    ...restOldOptions,
    ...restNewOptions,
    headers: {
      ...oldHeaders,
      ...newHeaders,
    },
  };
};

/**
 * Obtiene el método de request y el body (si es que tiene),
 * devuelve un objeto con las opciones del header
 * @param {string} method
 * @param {Object} data
 * @returns {Object}
 */
const getMethod = (method, data = null) => {
  if (!data) {
    return { method };
  }
  return { method, body: JSON.stringify(data) };
};

/**
 * Obtiene el query string de un objeto sin el `?` inicial
 * @param {Object} data
 * @returns {string}
 */
const getQueryString = data => {
  return new URLSearchParams(data).toString();
};

class Api {
  headers = {
    headers: {
      Accept: "application/json",
      // "Content-Type": "application/json; charset=UTF-8",
      // "Access-Control-Allow-Origin": "*",
    },
  };
  authorize = null;
  ENDPOINT = "";
  AUTHORIZE_STORAGE = "authorize";
  hasToken = true;

  /**
   * Constructor que recibe obligatoriamente el endpoint
   * @param {string} endpoint
   * @param {boolean} hasToken
   * @param {Object} options
   */
  constructor(endpoint, hasToken = true, options = {}) {
    this._setHeaders(options);
    this.ENDPOINT = endpoint;

    // Si tiene token los servicios
    this.hasToken = hasToken;
  }

  /**
   * Setea los headers por default para los request
   * @param {Object} options
   * @param {boolean} replace
   */
  _setHeaders(options, replace = false) {
    if (replace) {
      this.headers = options;
    } else {
      this.headers = mergeHeaders(this.headers, options);
    }
  }

  /**
   * Verifica los status del response y devuelve el mismo response
   * @param {Object} response
   * @returns {Object}
   */
  _checkAuth(response) {
    // No autorizado entonces hago logout
    if (response.status === 401) {
      // store.dispatch(logout());
      // TODO: Auth.logout()
    }

    // Forbidden entonces hago redirect
    if (response.status === 403) {
      // TODO: redirect
    }
    return response;
  }

  /**
   * Resuelve el parse del JSON y devuelve ok en caso de éxito
   * @param {Object} response
   * @returns {(null|Promise)}
   */
  _parseJSON(response) {
    // React status devuelve null
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return new Promise(resolve => response.json().then(json => resolve({ ok: response.ok, json })));
  }

  /**
   * Obtiene la url con los parámetros del data
   * @param {string} uri
   * @param {Object} data
   * @returns {string}
   */
  qs(uri, data = null) {
    const queryString = getQueryString(data);
    return `${uri}?${queryString}`;
  }

  /**
   * Genera un request
   * @param {string} uri
   * @param {Object} options
   * @returns {Promise}
   */
  request(uri, options = {}) {
    let headers = mergeHeaders(this.headers, options);

    return new Promise((resolve, reject) => {
      fetch(this.ENDPOINT + uri, headers)
        .then(this._checkAuth)
        .then(this._parseJSON)
        .then(response => {
          // Resuelvo el response con los datos devuelto del servidor
          if (response.ok) {
            return resolve(response.json);
          }
          // Rechazo el response con el error devuelto del servidor
          // store.dispatch(
          //   showNotification("Error inesperado", "Hubo un error al realizar la consulta.", "error")
          // );
          return reject(response.json);
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Genera un request con método GET
   * @param {string} uri
   * @param {Object} data query string
   * @param {Object} options
   * @returns {Promise}
   */
  get(uri, data = null, options = {}) {
    const headers = { ...options, ...getMethod("get") };

    // Si no tiene data
    if (!data) {
      return this.request(uri, headers);
    }
    return this.request(this.qs(uri, data), headers);
  }

  /**
   * Genera un request con método POST
   * @param {string} uri
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise}
   */
  post(uri, data = null, options = {}) {
    const headers = { ...options, ...getMethod("post", data) };
    return this.request(uri, headers);
  }

  /**
   * Genera un request con método PUT
   * @param {string} uri
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise}
   */
  put(uri, data = null, options = {}) {
    const headers = { ...options, ...getMethod("put", data) };
    return this.request(uri, headers);
  }

  /**
   * Genera un request con método DELETE
   * @param {string} uri
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise}
   */
  delete(uri, data = null, options = {}) {
    const headers = { ...options, ...getMethod("delete", data) };
    return this.request(uri, headers);
  }
}

export default Api;
