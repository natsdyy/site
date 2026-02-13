import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/valentines.tsx"),
  route("home", "routes/home.tsx"),
] satisfies RouteConfig;