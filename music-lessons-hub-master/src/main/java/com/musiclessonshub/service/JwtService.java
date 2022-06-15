package com.musiclessonshub.service;

import com.google.api.client.util.Value;
import com.musiclessonshub.bean.MinimalJwtUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.Getter;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value()
    private Long expireHours = 24L;

    public static String secret = "plainsecretasdata123";

    @Getter
    private String encodedSecret;

    public Authentication getAuthorization(String token) {
        return getUser(this.encodedSecret, token);
    }

    public String getToken(MinimalJwtUser jwtUser) {
        return getToken(this.encodedSecret, jwtUser);
    }

    @PostConstruct
    protected void init() {
        this.encodedSecret = generateEncodedSecret(secret);
    }

    private String generateEncodedSecret(String plainSecret) {

        if (StringUtils.isEmpty(plainSecret)) {
            throw new IllegalArgumentException("JWT secret cannot be null or empty.");
        }
        return Base64
                .getEncoder()
                .encodeToString(secret.getBytes());
    }

    private Date getExpirationTime() {

        Date now = new Date();
        Long expireInMilis = TimeUnit.HOURS.toMillis(expireHours);
        return new Date(expireInMilis + now.getTime());
    }

    private Authentication getUser(String encodedSecret, String token) {

        Claims claims = Jwts.parser()
                .setSigningKey(encodedSecret)
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        @SuppressWarnings("unchecked")
        List<String> roleList = (List<String>) claims.get("roles");

        Collection<? extends GrantedAuthority> authorities = roleList
                .stream()
                .map(authority -> new SimpleGrantedAuthority(authority))
                .collect(Collectors.toList());

        return new UsernamePasswordAuthenticationToken(username, "", authorities);
    }

    private String getToken(String encodedSecret, MinimalJwtUser jwtUser) {

        Date now = new Date();

        List<String> array = new ArrayList<>();
        array.add(jwtUser.getRole());


        return Jwts.builder()
                .setId(UUID.randomUUID().toString())
                .setSubject(jwtUser.getUsername())
                .claim("roles", array)
                .setIssuedAt(now)
                .setExpiration(getExpirationTime())
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
}
