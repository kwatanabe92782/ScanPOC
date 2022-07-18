package com.kofax.scandemo.service;

import com.kofax.scandemo.model.Image;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Base64;

@Service
public class UploadService {

    public void UploadImage(Image image){
        try {
            FileOutputStream writer = new FileOutputStream(image.getIdentifier(),false);
            writer.write(Base64.getDecoder().decode(image.getData()));
            writer.flush();
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
