'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Location } from '@/data/locations';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapViewProps {
  locations: Location[];
  university: string;
}

declare global {
  interface Window {
    google: typeof google;
  }
}

export default function GoogleMapView({ locations, university }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.');
      setIsLoading(false);
      return;
    }
    
    if (!locations || locations.length === 0) {
      setError('No locations with addresses to display on the map.');
      setIsLoading(false);
      return;
    }

    const loader = new Loader({
      apiKey,
      version: 'weekly',
    });

    loader.load().then(() => {
      // Create geocoder to convert addresses to coordinates
      const geocoder = new google.maps.Geocoder();
      
      // Filter out locations without addresses
      const locationsWithAddresses = locations.filter(loc => loc.exactAddress);
      
      if (locationsWithAddresses.length === 0) {
        setError('No locations with addresses to display on the map.');
        setIsLoading(false);
        return;
      }
      
      // Default center to first location's address or university name if none have addresses
      const defaultAddress = locationsWithAddresses[0]?.exactAddress || university;
      
      // Center map on the first location or university name
      geocoder.geocode({ address: defaultAddress }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const center = results[0].geometry.location;
          
          // Create the map
          const map = new google.maps.Map(mapRef.current!, {
            center,
            zoom: 15,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
          });
          
          // Add markers for each location
          locationsWithAddresses.forEach((location) => {
            if (location.exactAddress) {
              geocoder.geocode({ address: location.exactAddress }, (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
                  const position = results[0].geometry.location;
                  
                  // Create marker
                  const marker = new google.maps.Marker({
                    position,
                    map,
                    title: location.name,
                    icon: {
                      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                      scaledSize: new google.maps.Size(40, 40),
                    },
                    animation: google.maps.Animation.DROP,
                  });
                  
                  // Add info window
                  const infoWindow = new google.maps.InfoWindow({
                    content: `
                      <div style="padding: 8px; max-width: 250px;">
                        <h3 style="font-weight: bold; margin-bottom: 5px;">${location.name}</h3>
                        <p style="margin: 0 0 5px 0;"><strong>Building:</strong> ${location.building}</p>
                        ${location.floor ? `<p style="margin: 0 0 5px 0;"><strong>Floor:</strong> ${location.floor}</p>` : ''}
                        ${location.room ? `<p style="margin: 0 0 5px 0;"><strong>Room:</strong> ${location.room}</p>` : ''}
                        <p style="margin: 0 0 5px 0;"><strong>Address:</strong> ${location.exactAddress}</p>
                        ${location.description ? `<p style="margin: 0;">${location.description}</p>` : ''}
                      </div>
                    `,
                  });
                  
                  marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                  });
                }
              });
            }
          });
          
          setIsLoading(false);
        } else {
          setError(`Could not geocode default location. Status: ${status}`);
          setIsLoading(false);
        }
      });
    }).catch(err => {
      setError(`Error loading Google Maps: ${err.message}`);
      setIsLoading(false);
    });
  }, [locations, university]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">Lost & Found Locations Map</h2>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center h-96 bg-gray-100">
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
            <p className="mt-2 text-sm text-gray-600">
              Make sure you've added exact addresses to your locations and configured the Google Maps API key.
            </p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className={`h-96 w-full ${isLoading || error ? 'hidden' : 'block'}`}
      ></div>
    </div>
  );
} 