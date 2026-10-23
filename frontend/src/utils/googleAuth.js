/**
 * OMNIFIT Google Identity Services (GIS) OAuth Utility
 */
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '674047023079-kpq3utcb1gortud5dil8fosadrvo48g6.apps.googleusercontent.com';

/**
 * Decodes a Google JWT Credential Token safely
 */
export function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.warn('Could not parse Google JWT:', e);
        return null;
    }
}

/**
 * Initializes Google Identity Services (GIS) and optionally renders the official Google button
 */
export function initGoogleAuth(onSuccess, buttonElementId = null) {
    if (typeof window === 'undefined' || !window.google?.accounts?.id) {
        return false;
    }

    try {
        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
                const profile = parseJwt(response.credential);
                if (profile && profile.email) {
                    onSuccess({
                        email: profile.email,
                        name: profile.name || profile.given_name || profile.email.split('@')[0],
                        avatar: profile.picture,
                        googleId: profile.sub,
                        credential: response.credential
                    });
                }
            }
        });

        if (buttonElementId) {
            const el = document.getElementById(buttonElementId);
            if (el) {
                el.innerHTML = '';
                window.google.accounts.id.renderButton(el, {
                    theme: 'filled_black',
                    size: 'large',
                    width: '100%',
                    text: 'continue_with',
                    shape: 'rectangular'
                });
            }
        }

        return true;
    } catch (err) {
        console.warn('Google Identity Services initialization notice:', err);
        return false;
    }
}

/**
 * Triggers Google One-Tap or Google Account Chooser
 */
export function promptGoogleOneTap() {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
        try {
            window.google.accounts.id.prompt();
        } catch (e) {
            console.warn('Google One-Tap notice:', e);
        }
    }
}
