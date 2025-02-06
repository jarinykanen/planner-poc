/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as PlannerPocWorkersImport } from './routes/planner-poc/workers'
import { Route as PlannerPocProjectsImport } from './routes/planner-poc/projects'
import { Route as PlannerPocOverviewImport } from './routes/planner-poc/overview'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const PlannerPocWorkersRoute = PlannerPocWorkersImport.update({
  id: '/planner-poc/workers',
  path: '/planner-poc/workers',
  getParentRoute: () => rootRoute,
} as any)

const PlannerPocProjectsRoute = PlannerPocProjectsImport.update({
  id: '/planner-poc/projects',
  path: '/planner-poc/projects',
  getParentRoute: () => rootRoute,
} as any)

const PlannerPocOverviewRoute = PlannerPocOverviewImport.update({
  id: '/planner-poc/overview',
  path: '/planner-poc/overview',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/planner-poc/overview': {
      id: '/planner-poc/overview'
      path: '/planner-poc/overview'
      fullPath: '/planner-poc/overview'
      preLoaderRoute: typeof PlannerPocOverviewImport
      parentRoute: typeof rootRoute
    }
    '/planner-poc/projects': {
      id: '/planner-poc/projects'
      path: '/planner-poc/projects'
      fullPath: '/planner-poc/projects'
      preLoaderRoute: typeof PlannerPocProjectsImport
      parentRoute: typeof rootRoute
    }
    '/planner-poc/workers': {
      id: '/planner-poc/workers'
      path: '/planner-poc/workers'
      fullPath: '/planner-poc/workers'
      preLoaderRoute: typeof PlannerPocWorkersImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/planner-poc/overview': typeof PlannerPocOverviewRoute
  '/planner-poc/projects': typeof PlannerPocProjectsRoute
  '/planner-poc/workers': typeof PlannerPocWorkersRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/planner-poc/overview': typeof PlannerPocOverviewRoute
  '/planner-poc/projects': typeof PlannerPocProjectsRoute
  '/planner-poc/workers': typeof PlannerPocWorkersRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/planner-poc/overview': typeof PlannerPocOverviewRoute
  '/planner-poc/projects': typeof PlannerPocProjectsRoute
  '/planner-poc/workers': typeof PlannerPocWorkersRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/planner-poc/overview'
    | '/planner-poc/projects'
    | '/planner-poc/workers'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/planner-poc/overview'
    | '/planner-poc/projects'
    | '/planner-poc/workers'
  id:
    | '__root__'
    | '/'
    | '/planner-poc/overview'
    | '/planner-poc/projects'
    | '/planner-poc/workers'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  PlannerPocOverviewRoute: typeof PlannerPocOverviewRoute
  PlannerPocProjectsRoute: typeof PlannerPocProjectsRoute
  PlannerPocWorkersRoute: typeof PlannerPocWorkersRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PlannerPocOverviewRoute: PlannerPocOverviewRoute,
  PlannerPocProjectsRoute: PlannerPocProjectsRoute,
  PlannerPocWorkersRoute: PlannerPocWorkersRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/planner-poc/overview",
        "/planner-poc/projects",
        "/planner-poc/workers"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/planner-poc/overview": {
      "filePath": "planner-poc/overview.tsx"
    },
    "/planner-poc/projects": {
      "filePath": "planner-poc/projects.tsx"
    },
    "/planner-poc/workers": {
      "filePath": "planner-poc/workers.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
