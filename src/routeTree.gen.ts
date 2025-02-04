/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ProjectsImport } from './routes/projects'
import { Route as PeopleImport } from './routes/people'
import { Route as OverviewImport } from './routes/overview'
import { Route as HomeImport } from './routes/home'
import { Route as IndexImport } from './routes/index'

// Create/Update Routes

const ProjectsRoute = ProjectsImport.update({
  id: '/projects',
  path: '/projects',
  getParentRoute: () => rootRoute,
} as any)

const PeopleRoute = PeopleImport.update({
  id: '/people',
  path: '/people',
  getParentRoute: () => rootRoute,
} as any)

const OverviewRoute = OverviewImport.update({
  id: '/overview',
  path: '/overview',
  getParentRoute: () => rootRoute,
} as any)

const HomeRoute = HomeImport.update({
  id: '/home',
  path: '/home',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
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
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeImport
      parentRoute: typeof rootRoute
    }
    '/overview': {
      id: '/overview'
      path: '/overview'
      fullPath: '/overview'
      preLoaderRoute: typeof OverviewImport
      parentRoute: typeof rootRoute
    }
    '/people': {
      id: '/people'
      path: '/people'
      fullPath: '/people'
      preLoaderRoute: typeof PeopleImport
      parentRoute: typeof rootRoute
    }
    '/projects': {
      id: '/projects'
      path: '/projects'
      fullPath: '/projects'
      preLoaderRoute: typeof ProjectsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/home': typeof HomeRoute
  '/overview': typeof OverviewRoute
  '/people': typeof PeopleRoute
  '/projects': typeof ProjectsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/home': typeof HomeRoute
  '/overview': typeof OverviewRoute
  '/people': typeof PeopleRoute
  '/projects': typeof ProjectsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/home': typeof HomeRoute
  '/overview': typeof OverviewRoute
  '/people': typeof PeopleRoute
  '/projects': typeof ProjectsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/home' | '/overview' | '/people' | '/projects'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/home' | '/overview' | '/people' | '/projects'
  id: '__root__' | '/' | '/home' | '/overview' | '/people' | '/projects'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  HomeRoute: typeof HomeRoute
  OverviewRoute: typeof OverviewRoute
  PeopleRoute: typeof PeopleRoute
  ProjectsRoute: typeof ProjectsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  HomeRoute: HomeRoute,
  OverviewRoute: OverviewRoute,
  PeopleRoute: PeopleRoute,
  ProjectsRoute: ProjectsRoute,
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
        "/home",
        "/overview",
        "/people",
        "/projects"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/home": {
      "filePath": "home.tsx"
    },
    "/overview": {
      "filePath": "overview.tsx"
    },
    "/people": {
      "filePath": "people.tsx"
    },
    "/projects": {
      "filePath": "projects.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
