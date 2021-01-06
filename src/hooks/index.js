import { Maybe } from "jazzi";
import { pathOr, path } from "ramda";
import { useSelector } from "react-redux";

export const usePathSelector = (_path) => {
    return useSelector(path(_path.split(".")))
}

export const usePathSelectorOr = (_path,or) => {
    return useSelector(pathOr(or,_path.split(".")))
}

export const useMaybeFromState = selector => {
    return Maybe.of(useSelector(selector))
}

export const useMaybeFromPath = path => {
    return Maybe.of(usePathSelector(path))
}