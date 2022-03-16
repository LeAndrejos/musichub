package com.musiclessonshub.filter;

import com.musiclessonshub.service.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtFilter extends AbstractAuthenticationProcessingFilter {

    private JwtService jwtTokenService;
    private String authHeader;

    public JwtFilter(String defaultFilterProcessesUrl, JwtService jwtTokenService, String authHeader) {

        super(new AntPathRequestMatcher(defaultFilterProcessesUrl));

        this.jwtTokenService = jwtTokenService;
        this.authHeader = authHeader;
    }

    @Override public void destroy() {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        final HttpServletRequest httpRequest = (HttpServletRequest) request;
        final HttpServletResponse httpResponse = (HttpServletResponse) response;

        final String authHeaderVal = httpRequest.getHeader(authHeader);

        if (authHeaderVal == null) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            Authentication authentication = jwtTokenService.getAuthorization(authHeaderVal);
            System.out.println(authentication.toString());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        catch(JwtException e) {
            httpResponse.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            return;
        }

        chain.doFilter(httpRequest, httpResponse);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpRequest, HttpServletResponse httpResponse)
            throws AuthenticationException, IOException, ServletException {

        return null;
    }
}
