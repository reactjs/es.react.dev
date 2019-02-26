class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // El componente Toolbar debe tener un prop adicional "theme"
  // y pasarlo a ThemedButton. Esto puede llegar a ser trabajoso
  // si cada botón en la aplicación necesita saber el tema,
  // porque tendría que pasar a través de todos los componentes.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
