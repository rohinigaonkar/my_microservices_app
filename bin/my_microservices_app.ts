#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';

import { NetworkStack } from '../lib/Network-stack';
import { AppleMS } from '../lib/AppleMicroservice-stack';
import { BlueberryMS } from '../lib/BlueberryMicroservice-stack';

const app = new cdk.App();


// ## DEVELOPMENT ENVIRONMENT STACKS
// ### Infrastructure Network
const Dev_Network = new NetworkStack(app, "BaseDevNetwork", { envName: "dev-" });

// ### APPLE Microservice - Launches EC2 instance in the Base Network VPC
new AppleMS(app, "Dev1-AppleMS", { parent: Dev_Network, envName: "dev1-" })


// ### BLUEBERRY Microservices - Launches EKS Cluster in the Base Network VPC
new BlueberryMS(app, "Dev2-BlueberryMS", { parent: Dev_Network, envName: "dev2-" })
