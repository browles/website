function HSL_to_RGB(hsl) {
    var {h,s,l} = hsl;

    var C = (1 - Math.abs(2*l - 1)) * s;
    var m = l - C * 0.5;
    var X = C * (1 - Math.abs(h / 60 % 2 - 1));
    var r = 0;
    var g = 0;
    var b = 0;
    if (0 <= h && h < 60) {
        r = C;
        g = X;
    }
    else if (60 <= h && h < 120) {
        r = X;
        g = C;
    }
    else if (120 <= h && h < 180) {
        g = C;
        b = X;
    }
    else if (180 <= h && h < 240) {
        g = X;
        b = C;
    }
    else if (240 <= h && h < 300) {
        r = X;
        b = C;
    }
    else if (300 <= h && h < 360) {
        r = C;
        b = X;
    }
    r = (r + m) * 256 | 0;
    g = (g + m) * 256 | 0;
    b = (b + m) * 256 | 0;

    return {r, g, b};
}

export function rainbow(range) {
    var colors = new Array(range);
    var scale = 360 / range;
    var s = 0.5;
    var l = 0.5;
    for (var i = 0; i < range; i++) {
        var h = i * scale;
        colors[i] = HSL_to_RGB({h, s, l});
    }
    return colors;
}

export function cubehelix(start, rotations, hue, range) {
    var colors = new Array(range);
    var scale = 1 / range;
    for (var i = 0; i < range; i++) {
        var lambda = i * scale;
        var phi = 2 * Math.PI * (start / 3 + lambda * 4);
        var a = hue * lambda * (1 - lambda) / 2;

        var cp = Math.cos(phi);
        var sp = Math.sin(phi);

        var r = lambda + a * (cp * -0.14861 + sp * 1.78277);
        var g = lambda + a * (cp * -0.29227 + sp * -0.90649);
        var b = lambda + a * (cp * 1.97294 + sp * 0);


        r = r * 256 | 0;
        g = g * 256 | 0;
        b = b * 256 | 0;

        if (r < 0) r = 0;
        if (g < 0) g = 0;
        if (b < 0) b = 0;

        if (r > 255) r = 255;
        if (g > 255) g = 255;
        if (b > 255) b = 255;

        colors[i] = {r, g, b};
    }
    return colors;
}
