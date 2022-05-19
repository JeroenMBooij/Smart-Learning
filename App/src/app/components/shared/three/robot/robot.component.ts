import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DARK_THEME_PRIMARY_COLOR, LIGHT_THEME_PRIMARY_COLOR } from 'src/app/common/constants/theme.constants';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { Robot } from './robot.model';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { ROBOT_EMOTES, ROBOT_IDLE_STATE, ROBOT_STATES } from 'src/app/common/constants/robot.constants';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss']
})
export class RobotComponent implements OnInit 
{

    @Input()
    set state(value: string)
    {
        if(this.robot)
            if(value)
                this.robot.fadeToAction(value, 0.2);
        else
            this.initialState = value;
    }

    @Input()
    set emote(value: string)
    {
        if(this.robot && this.robot.actions)
            if(value)
                this.robot.executeEmote(value);
        else
            this.initialEmote = value;
    }

    @Input()
    public roboId: number = 1;

    @Input()
    public horizontalOrientation: number = -0.6;

    @ViewChild('robotContainer') container: ElementRef


    private robot: Robot;
    private initialState: string;
    private initialEmote: string;

    
    constructor() 
    {
    }

    ngOnInit(): void 
    {
    }

    ngAfterViewInit(): void 
    {
        this.initRobot();
        window[`robot-${this.roboId}`] = this.robot;
        this.robot.animate();
    }

    ngOnDestroy(): void
    {
        window.cancelAnimationFrame(window[`roboRequestAnimationId-${this.roboId}`]);
        delete window[`robot-${this.roboId}`];

    }

    private initRobot(): void
    {
        this.robot = new Robot();
        this.robot.id = this.roboId;
        this.robot.camera = new THREE.PerspectiveCamera(30, this.container.nativeElement.clientWidth / this.container.nativeElement.clientHeight);
        this.robot.camera.position.set(-17, 7.2, 10);

        this.robot.camera.lookAt(new THREE.Vector3(17.5, 3, -10));

        this.robot.scene = new THREE.Scene();
        this.robot.scene.background = null;

        this.robot.clock = new THREE.Clock();

        // lights

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 20, 0);
        this.robot.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 20, 10);
        this.robot.scene.add(dirLight);

        const loader = new GLTFLoader();
        loader.load('../../../../../assets/gltf/RobotExpressive.glb', (gltf) => 
        {

            let model = gltf.scene;
            model.rotation.set(0, this.horizontalOrientation, 0)
            model.position.set(1.5, -0.5, 0);
            this.robot.scene.add(model);

            this.createControls(model, gltf.animations);

        }, undefined, function (e) 
        {
            console.error(e);
        });

        this.robot.renderer = new THREE.WebGLRenderer(
        { 
            antialias: true,
            alpha: true
        });
        this.robot.renderer.setPixelRatio(window.devicePixelRatio);
        this.robot.renderer.setSize(this.container.nativeElement.clientWidth, this.container.nativeElement.clientHeight);
        this.robot.renderer.outputEncoding = THREE.sRGBEncoding;
        this.robot.renderer.setClearColor(0x000000, 0);
        this.container.nativeElement.appendChild(this.robot.renderer.domElement);

        window.addEventListener('resize', () => this.onWindowResize(this.roboId));

        this.robot.controls = new FlyControls(this.robot.camera, this.robot.renderer.domElement);
    }

    private createControls(model, animations) 
    {
        this.robot.mixer = new THREE.AnimationMixer(model);

        this.robot.actions = {};

        for (let i = 0; i < animations.length; i ++) {

            const clip = animations[i];
            const action = this.robot.mixer.clipAction(clip);
            this.robot.actions[ clip.name ] = action;

            if (ROBOT_EMOTES.indexOf(clip.name) >= 0 || ROBOT_STATES.indexOf(clip.name) >= 4) 
            {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }

        this.robot.activeAction = this.robot.actions[this.initialState ?? ROBOT_IDLE_STATE];
        this.robot.activeActionName = this.initialState ?? ROBOT_IDLE_STATE;
        this.robot.activeAction.play();
    }

    private onWindowResize(roboId) 
    {
        let ref = window[`robot-${roboId}`];
        let container = document.getElementById(`robot-${roboId}`);
        ref.camera.aspect = container.clientWidth / container.clientHeight;
        ref.camera.updateProjectionMatrix();

        ref.renderer.setSize(container.clientWidth, container.clientHeight);
    }


}
