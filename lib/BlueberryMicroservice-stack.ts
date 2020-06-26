import * as cdk from '@aws-cdk/core';

import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as eks from '@aws-cdk/aws-eks';

import { NetworkStack } from './Network-stack';


export interface NetworkProps extends cdk.StackProps {
  parent: NetworkStack
  envName: string;
}

export class BlueberryMS extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: NetworkProps) {
    super(scope, id, props);

    // ##############################################################################
    // CREATE A EKS CLUSTER FOR THE BlueberryMS MICROSERVICE IN THE NETWORK STACK VPC
    // ##############################################################################  

    // Import existing IAM User to be added to 
    const demoUser = iam.User.fromUserName(this, "demo", "demo");

    // first define the role
    const clusterAdmin = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.ArnPrincipal(demoUser.userArn)
    });

    // add required policy
    clusterAdmin.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"));

    // now define the cluster with Kubectl enabled and define the MastersRole 
    const cluster = new eks.Cluster(this, "myFirstCluster", {
      vpc: props.parent.vpc,
      kubectlEnabled: true,
      mastersRole: clusterAdmin,
      outputMastersRoleArn: true,
      outputConfigCommand: true
    });

    //map role to "masters" RBAC group
    new eks.AwsAuth(this, "adduser", { cluster }).addUserMapping(demoUser, {
      username: demoUser.userArn,
      groups: ["system:masters"]
    });


    // IAM role for our EC2 worker nodes in Autoscaling group
    const workerRole = new iam.Role(this, 'EKSWorkerRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    // Define the Autoscaling group
    const onDemandASG = new autoscaling.AutoScalingGroup(this, 'OnDemandASG', {
      vpc: props.parent.vpc,
      role: workerRole,
      minCapacity: 1,
      maxCapacity: 10,
      instanceType: new ec2.InstanceType('t3.medium'),
      machineImage: new eks.EksOptimizedImage({
        kubernetesVersion: '1.16',
        nodeType: eks.NodeType.STANDARD  // without this, incorrect SSM parameter for AMI is resolved
      }),
      updateType: autoscaling.UpdateType.ROLLING_UPDATE
    });

    // Add Autoscaling Group to the EKS Cluster
    cluster.addAutoScalingGroup(onDemandASG, {});

  }
}
