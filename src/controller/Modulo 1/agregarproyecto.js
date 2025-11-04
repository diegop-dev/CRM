
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; 


export function getProyectoForm(proyecto = {}, mode = "crear") {
  return <ProyectoFormView proyecto={proyecto} mode={mode} />;
}
