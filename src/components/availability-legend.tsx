/**
 * @fileoverview This module defines the AvailabilityLegend component for use
 * in the Event View page. The legend tells the user the number of people that
 *  correspond to the color of a given time slot in the time select chart.
 * @package rainbowvis.js is used to map a number range to a color spectrum 
 * from our chosen color palette.
 * 
 */
import Rainbow from "rainbowvis.js";

import style from "./availability-legend.module.css";

export const AvailabilityLegend = ({ numUsers }: { numUsers: number }) => {
  const myGradient = new Rainbow();
  myGradient.setNumberRange(-1, numUsers);
  myGradient.setSpectrum("#FFE5CF", "#091094");
  let colorLegendArray = [];
  for (let numAvail = 0; numAvail < numUsers; numAvail++) {
    colorLegendArray.push(
      <li key={numAvail}>
        <span
          className={style.legendElement}
          style={{ background: "#" + myGradient.colourAt(numAvail - 1) }}
        >
          {" "}
        </span>{" "}
        {numAvail + 1} Available
      </li>
    );
  }
  return <ul className={style.ul}>{colorLegendArray}</ul>;
};
