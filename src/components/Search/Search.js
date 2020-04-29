import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class Search extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: "Realiza una búsqueda en Google o escribir una URL",
  };

  render() {
    const { placeholder } = this.props;

    return (
      <div className="Search">
        
        <input type="text" autoComplete="off" placeholder={placeholder} />
      </div>
    );
  }
}

export default Search;
