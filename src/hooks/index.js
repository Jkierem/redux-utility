import { pathOr } from "ramda";
import { useSelector } from "react-redux";

export const usePathSelector = (path,or) => {
    return useSelector(pathOr(or,path.split(".")))
}