package com.example.weather.service;

import com.example.weather.dto.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public WeatherResponse getWeatherByCity(String city) {
        String url = String.format("%s?q=%s&appid=%S&units=metric", apiUrl, city, apiKey);
        System.out.println("DEBUG: Requesting URL: " + url);
        return fetchFromApi(url);
    }


    public WeatherResponse getWeatherByCoords(double lat, double lon) {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=metric", apiUrl, lat, lon, apiKey);
        return fetchFromApi(url);
    }

    private WeatherResponse fetchFromApi(String url) {
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        WeatherResponse dto = new WeatherResponse();
        dto.setCityName((String) response.get("name"));

        Map<String, Object> main = (Map<String, Object>) response.get("main");
        dto.setTemperature(Double.parseDouble(main.get("temp").toString()));
        dto.setFeelsLike(Double.parseDouble(main.get("feels_like").toString()));

        List<Map<String, Object>> weatherList = (List<Map<String, Object>>) response.get("weather");
        dto.setDescription((String) weatherList.get(0).get("description"));
        return dto;
    }


}



