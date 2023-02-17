import { useContext } from "react";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
// ADM App
import PowerBIHub from "./adm/PowerBIHub";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <PowerBIHub></PowerBIHub>
    </div>
  );
}
