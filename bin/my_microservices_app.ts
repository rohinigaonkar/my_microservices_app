#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyMicroservicesAppStack } from '../lib/my_microservices_app-stack';

const app = new cdk.App();
new MyMicroservicesAppStack(app, 'MyMicroservicesAppStack');
