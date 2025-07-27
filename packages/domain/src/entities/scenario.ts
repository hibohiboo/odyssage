// @copilot-context naming
import { Scene } from './scene';

export type Visibility = 'private' | 'draft' | 'public';

export interface ScenarioProps {
  id: string;
  title: string;
  overview: string;
  userId: string;
  visibility: Visibility;
  scenes?: Scene[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Scenario {
  readonly id: string;

  readonly userId: string;

  private title_: string;

  private overview_: string;

  private visibility_: Visibility;

  private scenes_: Scene[];

  readonly createdAt: Date;

  private updatedAt_: Date;

  constructor(props: ScenarioProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.title_ = props.title;
    this.overview_ = props.overview;
    this.visibility_ = props.visibility;
    this.scenes_ = props.scenes || [];
    this.createdAt = props.createdAt || new Date();
    this.updatedAt_ = props.updatedAt || new Date();
  }

  get title(): string {
    return this.title_;
  }

  get overview(): string {
    return this.overview_;
  }

  get visibility(): Visibility {
    return this.visibility_;
  }

  get scenes(): Scene[] {
    return [...this.scenes_];
  }

  get updatedAt(): Date {
    return this.updatedAt_;
  }

  updateTitle(title: string): void {
    this.title_ = title;
    this.updatedAt_ = new Date();
  }

  updateOverview(overview: string): void {
    this.overview_ = overview;
    this.updatedAt_ = new Date();
  }

  updateVisibility(visibility: Visibility): void {
    this.visibility_ = visibility;
    this.updatedAt_ = new Date();
  }

  addScene(scene: Scene): void {
    this.scenes_.push(scene);
    this.updatedAt_ = new Date();
  }

  removeScene(sceneId: string): void {
    this.scenes_ = this.scenes_.filter((scene) => scene.id !== sceneId);
    this.updatedAt_ = new Date();
  }
}
