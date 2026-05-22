/*Local vs Offshore investment studio container.
–	Manages input state
–	Computes: ZAR portfolio growth at JSE return rate
–	Computes: Offshore portfolio growth with currency conversion assumption
–	Passes data to ProjectionChart and StudioVerdict

*/
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../../Studios.module.css";