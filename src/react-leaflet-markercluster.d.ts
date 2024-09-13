declare module 'react-leaflet-markercluster' {
    import { FC } from 'react';
    import { MarkerClusterGroupOptions } from 'leaflet.markercluster';
  
    interface MarkerClusterGroupProps extends MarkerClusterGroupOptions {
      children: React.ReactNode;
    }
  
    const MarkerClusterGroup: FC<MarkerClusterGroupProps>;
  
    export default MarkerClusterGroup;
  }