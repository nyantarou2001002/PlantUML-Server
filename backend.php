<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $umlText = $data['uml'];
    $format = $data['format'];

    $url = "http://www.plantuml.com/plantuml/$format/";
    $encodedUml = encodeUml($umlText);
    $diagramUrl = $url . $encodedUml;

    $diagramContent = file_get_contents($diagramUrl);
    if ($format === 'txt') {
        header('Content-Type: text/plain');
    } elseif ($format === 'png') {
        header('Content-Type: image/png');
    } elseif ($format === 'svg') {
        header('Content-Type: image/svg+xml');
    }
    echo $diagramContent;
    exit;
}

if (isset($_GET['uml']) && isset($_GET['format'])) {
    $umlText = $_GET['uml'];
    $format = $_GET['format'];

    $url = "http://www.plantuml.com/plantuml/$format/";
    $encodedUml = encodeUml($umlText);
    $diagramUrl = $url . $encodedUml;

    header('Content-Disposition: attachment; filename="diagram.' . $format . '"');
    readfile($diagramUrl);
    exit;
}

function encodeUml($text)
{
    $compressed = gzdeflate($text, 9);
    return encode64($compressed);
}

function encode64($data)
{
    $str = '';
    $len = strlen($data);
    for ($i = 0; $i < $len; $i += 3) {
        if ($i + 2 == $len) {
            $str .= append3bytes(ord($data[$i]), ord($data[$i + 1]), 0);
        } elseif ($i + 1 == $len) {
            $str .= append3bytes(ord($data[$i]), 0, 0);
        } else {
            $str .= append3bytes(ord($data[$i]), ord($data[$i + 1]), ord($data[$i + 2]));
        }
    }
    return $str;
}

function append3bytes($b1, $b2, $b3)
{
    $c1 = $b1 >> 2;
    $c2 = (($b1 & 0x3) << 4) | ($b2 >> 4);
    $c3 = (($b2 & 0xF) << 2) | ($b3 >> 6);
    $c4 = $b3 & 0x3F;
    $str = '';
    $str .= encode6bit($c1 & 0x3F);
    $str .= encode6bit($c2 & 0x3F);
    $str .= encode6bit($c3 & 0x3F);
    $str .= encode6bit($c4 & 0x3F);
    return $str;
}

function encode6bit($b)
{
    if ($b < 10) return chr(48 + $b);
    $b -= 10;
    if ($b < 26) return chr(65 + $b);
    $b -= 26;
    if ($b < 26) return chr(97 + $b);
    $b -= 26;
    if ($b == 0) return '-';
    if ($b == 1) return '_';
    return '?';
}
