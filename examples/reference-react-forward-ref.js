// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Ahora puedes obtener un ref directamente al botón del DOM
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
