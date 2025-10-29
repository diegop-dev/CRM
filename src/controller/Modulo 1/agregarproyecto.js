
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; 

// Función que devuelve el componente del formulario
export function getProyectoForm(proyecto = {}, mode = "crear") {
  return <ProyectoFormView proyecto={proyecto} mode={mode} />;
}
