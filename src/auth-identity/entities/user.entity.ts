import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column({ type: 'varchar', length: 16 })
  role: 'buyer' | 'seller';

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
