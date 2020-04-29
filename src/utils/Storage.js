class Storage {
  /**
   * Obtiene el dato guardado en el localStorage del ítem
   * @param {string} item nombre del item
   * @returns {Object}
   */
  getItem(item) {
    return JSON.parse(localStorage.getItem(item));
  }

  /**
   * Guarda el ítem con el dato ingresado en el localStorage
   * @param {string} item nombre del item
   * @param {any} data    data a guardar
   */
  setItem(item, data) {
    localStorage.setItem(item, JSON.stringify(data));
  }

  /**
   * Remueve el ítem del localStorage
   * @param {(string|Array)} item nombre del item o un array de los items a eliminar
   */
  removeItems(items) {
    if (typeof items === "string") {
      localStorage.removeItem(items);
    } else {
      items.forEach(item => localStorage.removeItem(item));
    }
  }

  /**
   * Limpia todos los valores del localStorage
   */
  clear() {
    localStorage.clear();
  }
}

export { Storage };
export default new Storage();
