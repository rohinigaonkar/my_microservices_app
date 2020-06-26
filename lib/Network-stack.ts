import * as cdk from '@aws-cdk/core';

import * as ec2 from '@aws-cdk/aws-ec2';

export interface stackProperties extends cdk.StackProps {
  envName: string;
}


export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: cdk.App, id: string, props: stackProperties) {
    super(scope, id, props);

    const env = props.envName;

    // ##############################################################################
    // CREATE BASE VPC
    // ##############################################################################      

    this.vpc = new ec2.Vpc(this, env + "Vpc", {
      maxAzs: 2 // Default is all AZs in region
    });

  }
}
