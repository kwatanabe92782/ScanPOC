package com.kofax.scandemo.controller;

import com.kofax.scandemo.model.Image;
import com.kofax.scandemo.service.UploadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class UploadController {
    private final UploadService uploadService;

    public UploadController(UploadService service)
    {
        this.uploadService = service;
    }

    @PostMapping("/upload")
    public ResponseEntity  UploadImage(@RequestBody Image image)
    {
        uploadService.UploadImage(image);
        return ResponseEntity.ok(HttpStatus.ACCEPTED);
    }
}
