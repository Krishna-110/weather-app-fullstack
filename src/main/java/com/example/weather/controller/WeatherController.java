package com.example.weather.controller;

import com.example.weather.dto.WeatherResponse;
import com.example.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/city/{name}")
    public WeatherResponse getByCity(@PathVariable String name) {
        return weatherService.getWeatherByCity(name);
    }

    @GetMapping("/coords")
    public WeatherResponse getByCoords(@RequestParam double lat, @RequestParam double lon) {
        return weatherService.getWeatherByCoords(lat, lon);
    }

}
