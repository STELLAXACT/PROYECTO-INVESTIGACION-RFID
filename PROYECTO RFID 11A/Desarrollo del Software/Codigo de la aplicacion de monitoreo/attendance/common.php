<?php
require 'vendor/autoload.php';

use Medoo\Medoo;

$database = new Medoo([
    'type' => 'mysql',
    'database' => 'attendancesystem',
    'host' => 'localhost',
    'username' => 'attendanceadmin',
    'password' => 'pimylifeup'
]);

