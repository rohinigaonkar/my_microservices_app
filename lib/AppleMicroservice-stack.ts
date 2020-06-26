import * as cdk from '@aws-cdk/core';

import * as ec2 from '@aws-cdk/aws-ec2';

import { NetworkStack } from './Network-stack';

export interface NetworkProps extends cdk.StackProps {
  parent: NetworkStack
  envName: string;
}

export class AppleMS extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: NetworkProps) {
    super(scope, id, props);

    const env = props.envName;

    // ##############################################################################
    // CREATE AN EC2 INSTANCE FOR THE APPLE MICROSERVICE IN THE NETWORK STACK VPC
    // ##############################################################################  


      new ec2.Instance(this, env.toString() + "NodeInstance", {
        instanceName: env + "NodeInstance",
        vpc: props.parent.vpc,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.LARGE),
        machineImage: ec2.MachineImage.latestAmazonLinux({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 })

      });
    

  }
}
