# Geodata Dashboard UI

Dashboard providing data visualization of bird flu cases over time in Switzerland.

## Description

This dashboard provides a comprehensive overview of bird flu cases in Switzerland. It is designed to help users analyze and visualize the data through several key features. Below is a description of each section.

### Features

- **Filter Section**

  - **Purpose**: Allows users to filter the data based on specific criteria.
  - **Options**:
    - **Bird Species**: Filter by 12 different species.
    - **Virus Strains**: Filter by 4 types of strains.
    - **Provenance**: Filter by 2 types of provenance.

- **Map Section**

  - **Purpose**: Displays the locations of reported cases on a map.
  - **Details**: Data points are dotted on the map to represent where the reports were located. Users can zoom in for more detailed information.

- **Timeline Section**

  - **Purpose**: Shows trends over various time periods.
  - **Functionality**: Users can select a custom interval to filter the data visualization according to their needs.

- **Data Summary Section**
  - **Purpose**: Provides a summary of the data.
  - **Components**:
    - **Total Cases Reported**: Displays the total number of cases.
    - **Date Range**: Shows the range of dates covered.
    - **Unique Species**: Lists unique bird species detected for the current filters.
    - **Recent Trends**: Highlights recent trends in the data for the 4 virus strains.
    - **Recent Reports**: Provides the 10 most recent virus case reports.
    - **Pie Charts**: Includes two pie charts:
      - **Provenance Distribution**: Shows the distribution of cases by provenance.
      - **Strain Distribution**: Displays the distribution of cases by strain.

## Getting Started

### Dependencies

This project uses the following dependencies:

- **React**: A JavaScript library for building user interfaces. [React](https://reactjs.org/)
- **recharts**: A composable charting library built on React components. [recharts](https://recharts.org/)
- **react-feather**: A collection of customizable icons for React. [react-feather](https://feathericons.com/)
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript. [TypeScript](https://www.typescriptlang.org/)
- **Tailwind CSS**: A utility-first CSS framework for creating custom designs. [Tailwind CSS](https://tailwindcss.com/)
- **Leaflet**: A JavaScript library for interactive maps. [Leaflet](https://leafletjs.com/)

<details>
  <summary>Click to view more</summary>

  - **@mui/material**: Material-UI provides a set of React components that implement Google's Material Design. [MUI](https://mui.com/)
  - **Ant Design**: A design system for enterprise-level products. [Ant Design](https://ant.design/)
  - **chart.js**: A popular JavaScript library for creating charts. [Chart.js](https://www.chartjs.org/)
  - **react-chartjs-2**: A wrapper for Chart.js that makes it easy to use in React. [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2)
  - **react-datepicker**: A datepicker component for React. [react-datepicker](https://reactdatepicker.com/)
  - **lodash**: A JavaScript utility library that provides various functions for common programming tasks. [Lodash](https://lodash.com/)
  - **rc-slider**: A React component for sliders. [rc-slider](https://github.com/react-component/slider)
  - **react-papaparse**: A React wrapper for PapaParse, a powerful CSV parser. [react-papaparse](https://github.com/Greentube/react-papaparse)
  - **leaflet.markercluster**: A plugin for Leaflet that clusters markers on maps. [leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
  - **react-leaflet**: React components for Leaflet maps. [react-leaflet](https://react-leaflet.js.org/)
  - **react-leaflet-markercluster**: A React wrapper for the Leaflet.markercluster plugin. [react-leaflet-markercluster](https://github.com/flexdinesh/react-leaflet-markercluster)
  - **tailwind-scrollbar**: A plugin for adding custom scrollbars to Tailwind CSS. [tailwind-scrollbar](https://github.com/adoxography/tailwind-scrollbar)
  - **@emotion/react** and **@emotion/styled**: Libraries for writing CSS styles with JavaScript. [Emotion](https://emotion.sh/docs/introduction)
  - **@testing-library/react** and **@testing-library/jest-dom**: Libraries for testing React components and DOM elements. [Testing Library](https://testing-library.com/)
  - **typescript**: A typed superset of JavaScript that compiles to plain JavaScript. [TypeScript](https://www.typescriptlang.org/)
  - **web-vitals**: A library for measuring web performance. [web-vitals](https://github.com/GoogleChrome/web-vitals)

</details>

To install these dependencies, run:

```
npm install
```

### Installing

To set up this project locally, follow these steps:

1. **Clone the Repository**

```
git clone https://github.com/raullopesalves/geodata-dashboard-ui.git
```

2. **Navigate to the Project Directory**

```
cd geodata-dashboard-ui
```

3. **Install Dependencies**
   Install the project dependencies using npm:

```
npm install
```

This will install all necessary packages listed in package.json, including React, Tailwind CSS, Leaflet, and other libraries.

### Executing program

To run the development server and see the application in action:

- Start the Development Server

```
npm start
```

This will start the server and open the application in your default web browser at http://localhost:3000.

- Build for Production

```
npm run build
```

This will generate an optimized version of the app in the build directory, which can be deployed to a web server.

- Run Tests
  To run the project's tests, use:

```
npm test
```

This will execute the test suite and display the results in the terminal.

## Authors

Raúl Alves \
[LinkedIn](https://www.linkedin.com/in/ra%C3%BAl-alves-b870a8210/) \
[GitHub](https://github.com/raullopesalves)

## Version History

- 0.1
  - Initial Release
