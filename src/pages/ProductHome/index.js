import Nest from "./Nest";
import SeaGrapes from "./SeaGrapes";
import Cosmetics from "./Cosmetics";
import SeaweedJelly from "./SeaweedJelly";
function ProductHome() {
  return (
    <div>
      <Nest />
      <SeaGrapes></SeaGrapes>
      <Cosmetics></Cosmetics>
      <SeaweedJelly></SeaweedJelly>
    </div>
  );
}

export default ProductHome;
