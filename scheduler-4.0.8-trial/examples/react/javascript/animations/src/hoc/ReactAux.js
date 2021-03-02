/**
 *- Aux react container
 *
 * React allows only one element in jsx return. This is a wrapper
 * for more than one component to workaround React limitation. Although
 * we could use React.Fragment as the wrapper this file is left here
 * for the reference or for situation when Fragment is not preferred.
 */
const aux = props => props.children;

export default aux;

// eof