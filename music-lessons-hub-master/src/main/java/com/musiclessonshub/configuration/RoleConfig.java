package com.musiclessonshub.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

public class RoleConfig {

    public static String getRoleFromToken(String token){
        Claims claims = Jwts.parser().setSigningKey("secretkey").parseClaimsJws(token).getBody();
        return claims.get("roles").toString();
    }

    public static String getUsernameFromToken(String token){
        Claims claims = Jwts.parser().setSigningKey("secretkey").parseClaimsJws(token).getBody();
        return claims.get("sub").toString();
    }

    public static boolean isTokenValid(String token) {
        Claims claims = Jwts.parser().setSigningKey("secretkey").parseClaimsJws(token).getBody();
        String time = claims.get("exp").toString();
        return true;
    }
}
