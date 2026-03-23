package com.example.weather.dto;

import lombok.Data;

@Data
public class WeatherResponse {
    private String cityName;
    private double temperature;
    private String description;
    private double feelsLike;

}
